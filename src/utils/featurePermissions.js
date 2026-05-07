/**
 * Centralized Feature → Permission mapping.
 * 
 * Every company has up to 4 phases/features. The SuperManager assigns features
 * to a company. The Company Admin can only see/assign permissions belonging to
 * the features their company has access to.
 * 
 * Workers in the dashboard sidebar only see navigation items that match BOTH:
 *   1. Their company's enabled features
 *   2. Their personal task/permission list (assigned via their role)
 */

// ─── Feature ↔ Permission Map ────────────────────────────────────────────────

export const FEATURE_PERMISSIONS = {
  "Core": [
    "Dashboard"
  ],
  "CHECKLIST": [
    "Create Checklist",
    "Create Equipment",
    "Assign Checklist to Equipment",
    "Assign Task",
    "Task Execution",
    "Approve Equipment",
    "Review Task",
    "Approve Checklist",
    "Review Access",
    "Visual Review",
    "QA",
    "Approve Tagged Checklist with Equipment",
    "Approve Tagged Chechlist with Equipment", // Handling common typo in DB
  ],
  "NON-PHARMA-ELOGBOOK": [
    "Bucket Execution",
    "Master Data Management",
    "Quality Check",
    "Graphical Representation",
    "Worker Assignment",
    "Plant Monitor",
    "Utility Tracking",
  ],
  "PHARMA-ELOGBOOK": [],   // Phase 3 — Coming Soon
  "OPERATION": [],          // Phase 4 — Coming Soon
};

// ─── Human-Readable Labels ───────────────────────────────────────────────────

export const FEATURE_LABELS = {
  "CHECKLIST": "Checklist Management",
  "NON-PHARMA-ELOGBOOK": "E-Logbook (Non-Pharma)",
  "PHARMA-ELOGBOOK": "E-Logbook (Pharma)",
  "OPERATION": "Operations",
};

// ─── Feature Display Order ───────────────────────────────────────────────────

export const FEATURE_ORDER = [
  "CHECKLIST",
  "NON-PHARMA-ELOGBOOK",
  "PHARMA-ELOGBOOK",
  "OPERATION",
];

// ─── Feature Icons (emoji) ───────────────────────────────────────────────────

export const FEATURE_ICONS = {
  "CHECKLIST": "📋",
  "NON-PHARMA-ELOGBOOK": "📒",
  "PHARMA-ELOGBOOK": "💊",
  "OPERATION": "⚙️",
};

// ─── Old → New migration map ────────────────────────────────────────────────
// The old "ElogBook" single permission should be expanded into the 4 granular
// non-pharma elogbook permissions.

export const LEGACY_PERMISSION_MAP = {
  "ElogBook": [
    "Bucket Execution",
    "Master Data Management",
    "Quality Check",
    "Graphical Representation",
    "Worker Assignment",
    "Plant Monitor",
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns a flat array of all permissions available for a set of enabled features.
 * @param {string[]} enabledFeatures - e.g. ["CHECKLIST", "NON-PHARMA-ELOGBOOK"]
 * @returns {string[]} All valid permissions
 */
export function getPermissionsForFeatures(enabledFeatures = []) {
  return enabledFeatures.flatMap(f => FEATURE_PERMISSIONS[f] || []);
}

/**
 * Returns the feature key that a given permission belongs to.
 * @param {string} permission - e.g. "Create Checklist"
 * @returns {string|null} Feature key or null
 */
export function getFeatureForPermission(permission) {
  for (const [feature, permissions] of Object.entries(FEATURE_PERMISSIONS)) {
    if (permissions.includes(permission)) return feature;
  }
  return null;
}

/**
 * Migrates legacy permission names to their new equivalents. 
 * e.g. ["ElogBook", "Create Checklist"] → ["Bucket Execution", "Master Data Management", "Quality Check", "Graphical Representation", "Create Checklist"]
 * @param {string[]} tasks - Current task/permission array
 * @returns {string[]} Migrated array (deduped)
 */
export function migrateLegacyPermissions(tasks = []) {
  const migrated = [];
  for (const task of tasks) {
    if (LEGACY_PERMISSION_MAP[task]) {
      migrated.push(...LEGACY_PERMISSION_MAP[task]);
    } else {
      migrated.push(task);
    }
  }
  return [...new Set(migrated)];
}
