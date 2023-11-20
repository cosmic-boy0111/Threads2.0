import {Schema, model, models} from "mongoose";

const communitySchema = new Schema({
    id : { type : String, require : true},
    username : { type : String, require : true, unique : true},
    name : { type : String, require : true},
    image : String,
    bio : String,
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    threads : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Threads'
        }
    ],
    members : [
        {
            type : Schema.Types.ObjectId,
            ref : 'User'
        }
    ]
})

const Community = models.Community || model("Community" , communitySchema);

export default Community;