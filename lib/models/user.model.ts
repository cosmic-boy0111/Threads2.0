import {Schema, model, models} from "mongoose";

const userSchema = new Schema({
    id : { type : String, require : true},
    username : { type : String, require : true, unique : true},
    name : { type : String, require : true},
    image : String,
    bio : String,
    threads : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Threads'
        }
    ],
    onboarded : { type : Boolean, default : false },
    communities : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Community'
        }
    ]
})

const User = models.User || model("User" , userSchema);

export default User;