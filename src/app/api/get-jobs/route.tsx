import ConnectToDB from "../../../utils/connections/mongoose"
import mongoose from 'mongoose';



export async function GET(req:Request,res:Response) {
  let Dbconn=await ConnectToDB();
  if(Dbconn){
  const usercollection=await Dbconn.connection.collection("users");
  let data=await usercollection.find().toArray();
  console.log(data);

  }

  return Response.json({ message: "hello" }, { status: 200 });
}







