const mongoose = require('mongoose');

async function test() {
    await mongoose.connect('mongodb+srv://Pratham:Pratham123@cluster0.z2g7d.mongodb.net/sop?retryWrites=true&w=majority');
    const db = mongoose.connection.useDb('sop');
    const assignments = db.collection('assignments');
    
    // 69c64c51c0e1601ade3445c6
    const assignment = await assignments.findOne({ _id: new mongoose.Types.ObjectId('69c64c51c0e1601ade3445c6') });
    console.log(assignment ? 'Assignment found.' : 'Assignment not found.');
    if (assignment) {
        let hasStop = false;
        assignment.prototypeData.stages.forEach(stage => {
            stage.tasks.forEach(task => {
                if (task.addStop) {
                    console.log(`Task ${task.title} has addStop: ${task.addStop}`);
                    hasStop = true;
                }
            });
        });
        if (!hasStop) console.log('No addStop found in assignment!');
    }
    process.exit(0);
}

test().catch(console.error);
