import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import WorkerAssignment from "@/model/WorkerAssignment";
import User from "@/model/User";
import ElogbookBasket from "@/model/ElogbookBasket";

export const dynamic = "force-dynamic";

/**
 * GET — Fetch assignments for a plant/date, or available workers
 * Query params:
 *   companyId (required)
 *   plantId (required)
 *   date (optional, defaults to today)
 *   available=true — return workers NOT currently assigned to active lines
 */
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const plantId = searchParams.get("plantId");
    const userId = searchParams.get("userId");
    const dateParam = searchParams.get("date");
    const availableOnly = searchParams.get("available") === "true";

    if (!companyId || (!plantId && !userId && !availableOnly)) {
      return NextResponse.json(
        { success: false, message: "companyId and (plantId or userId) are required" },
        { status: 400 }
      );
    }

    // Normalize date to midnight
    const targetDate = dateParam ? new Date(dateParam) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    if (availableOnly) {
      // Fetch ALL workers with Bucket Execution access for this company
      const allWorkers = await User.find({
        companyId,
        task: { $in: ["Bucket Execution", "ElogBook"] },
        status: { $ne: "InActive" },
        role: { $nin: ["company-admin", "super-manager"] },
      }).select("_id name username role phone plantId");

      // Fetch ALL active assignments for today across the company
      const activeAssignments = await WorkerAssignment.find({
        companyId,
        date: targetDate,
        status: "active",
      }).select("userId");

      const assignedIds = activeAssignments.map((a) => a.userId.toString());

      // Check for workers with active baskets anywhere in the company
      const busyBaskets = await ElogbookBasket.find({
        companyId,
        status: { $in: ["in-progress", "stopped"] },
      }).select("startUser additionalUsers");

      // Mark each worker as available or busy
      const workersWithStatus = allWorkers.map((worker) => {
        const isAssigned = assignedIds.includes(worker._id.toString());

        // Check if worker has an active basket
        const hasBusyBasket = busyBaskets.some(
          (b) =>
            b.startUser === worker.name ||
            b.startUser === worker.username ||
            (b.additionalUsers && b.additionalUsers.includes(worker.name))
        );

        return {
          _id: worker._id,
          name: worker.name,
          username: worker.username,
          role: worker.role,
          phone: worker.phone,
          isAssigned,
          isBusy: hasBusyBasket,
          isAvailable: !isAssigned && !hasBusyBasket,
        };
      });

      return NextResponse.json({ success: true, data: workersWithStatus });
    }

    // Default: Fetch assignments for the plant on a given date
    const query = {
      companyId,
      date: targetDate,
    };

    if (plantId) query.plantId = plantId;
    if (userId) {
      query.userId = userId;
      query.status = "active";
    }

    const assignments = await WorkerAssignment.find(query)
      .populate("lineId", "lineNumber name")
      .populate("userId", "name username role phone")
      .populate("assignedBy", "name username")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: assignments });
  } catch (error) {
    console.error("WorkerAssignment GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST — Create a new worker assignment
 * Body: { companyId, plantId, lineId, userId, assignedBy }
 * Rules:
 *  - A worker can only have ONE active assignment at a time
 *  - Multiple workers CAN be assigned to the same line
 *  - Released workers can be re-assigned
 */
export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { companyId, plantId, lineId, userId, assignedBy } = body;

    if (!companyId || !plantId || !lineId || !userId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if this worker already has an active assignment today
    const existingActive = await WorkerAssignment.findOne({
      companyId,
      userId,
      date: today,
      status: "active",
    });

    if (existingActive) {
      // Already assigned to the SAME line — nothing to do
      if (existingActive.lineId.toString() === lineId) {
        return NextResponse.json(
          { success: false, message: "Worker is already assigned to this line today" },
          { status: 409 }
        );
      }

      // Assigned to a DIFFERENT line — check for active baskets before releasing
      const worker = await User.findById(userId);
      const activeBasketsOnLine = await ElogbookBasket.find({
        companyId,
        lineId: existingActive.lineId,
        status: { $in: ["in-progress", "stopped"] },
      });

      const hasActiveBasket = activeBasketsOnLine.some(
        (b) =>
          b.startUser === worker?.name ||
          b.startUser === worker?.username
      );

      if (hasActiveBasket) {
        return NextResponse.json(
          {
            success: false,
            message: "Worker has an active basket on another line. They must finish or pause it first.",
          },
          { status: 409 }
        );
      }

      // No active basket — release the old assignment
      existingActive.status = "released";
      await existingActive.save();
    }

    // Create the new assignment
    const assignment = await WorkerAssignment.create({
      companyId,
      plantId,
      lineId,
      userId,
      assignedBy: assignedBy || null,
      date: today,
      status: "active",
    });

    const populated = await WorkerAssignment.findById(assignment._id)
      .populate("lineId", "lineNumber name")
      .populate("userId", "name username role phone")
      .populate("assignedBy", "name username");

    return NextResponse.json({ success: true, data: populated }, { status: 201 });
  } catch (error) {
    console.error("WorkerAssignment POST error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT — Update an assignment (release/complete)
 * Body: { assignmentId, action: "release" | "complete" }
 */
export async function PUT(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { assignmentId, action } = body;

    if (!assignmentId || !action) {
      return NextResponse.json(
        { success: false, message: "assignmentId and action are required" },
        { status: 400 }
      );
    }

    const assignment = await WorkerAssignment.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json(
        { success: false, message: "Assignment not found" },
        { status: 404 }
      );
    }

    if (action === "release") {
      assignment.status = "released";
    } else if (action === "complete") {
      assignment.status = "completed";
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }

    await assignment.save();

    const populated = await WorkerAssignment.findById(assignment._id)
      .populate("lineId", "lineNumber name")
      .populate("userId", "name username role phone")
      .populate("assignedBy", "name username");

    return NextResponse.json({ success: true, data: populated });
  } catch (error) {
    console.error("WorkerAssignment PUT error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
