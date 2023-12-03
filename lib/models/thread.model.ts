import mongoose, {Schema, model, models, deleteModel} from "mongoose";

const threadsSchema = new Schema({
    text : { type : "string" , required: true },
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    files : [],
    community : {
        type : Schema.Types.ObjectId,
        ref : 'Community',
    },
    createdAt : {
        type : Date,
        default : new Date(),    
    },
    reposts : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Threads'
        }
    ],
    reposters : [
        {
            type : Schema.Types.ObjectId,
            ref : 'User',   
        }
    ],
    repostedBy : {
        type : Schema.Types.ObjectId,
        ref : 'User',
    },
    referenceThread : {
        type : Schema.Types.ObjectId,
        ref : 'Threads'
    },
    parentId : {
        type : String,
    },
    children : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Threads'
        }
    ]
})

if(models.Threads) deleteModel('Threads')

const Threads = models.Threads || model("Threads" , threadsSchema);

export default Threads;