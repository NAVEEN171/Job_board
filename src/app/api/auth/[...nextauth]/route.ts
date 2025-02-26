import ConnectToDB from "@/utils/connections/mongoose";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { generateToken } from "@/middlewares/Auth/generateToken";
export async function googleAuthentication(accessToken: string) {
  try {
    // Fetch user info using access token
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cross-Origin-Opener-Policy": "same-origin",
          "Cross-Origin-Embedder-Policy": "unsafe-none",
        },
      }
    );

    if (!response.ok) {
      return {
        message: "Failed to fetch user info",
        status: 401,
      };
    }

    const profile = await response.json();

    if (!profile.email) {
      return {
        message: "Invalid credentials",
        status: 401,
      };
    }

    const dbConn = await ConnectToDB();
    if (!dbConn) {
      return {
        message: "DB connection failed",
        status: 401,
      };
    }

    const userCollection = dbConn.connection.collection("users");
    let user = await userCollection.findOne({ email: profile.email });

    if (!user) {
      const newUser = {
        username: profile.name,
        email: profile.email,
        password: null,
        provider: "google",
        profilephoto: profile.picture || null,
      };

      const result = await userCollection.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    }
    const token = await generateToken(user);
    const refreshToken = await jwt.sign(
      { user },
      process.env.JWT_REFRESH_TOKEN!
    );
    console.log("access token is");
    console.log(token);

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      profilephoto: user.profilephoto,
      provider: "google",
      accessToken: token ? token : null,
      refreshToken: refreshToken ? refreshToken : null,
    };
  } catch (error) {
    console.error("Google authentication error:", error);
    return {
      message: "Authentication failed",
      status: 401,
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    const user = await googleAuthentication(token);
    console.log(user);

    if (!user.message) {
      return NextResponse.json({
        user,
        status: 200,
      });
    } else {
      return NextResponse.json({
        message: user.message,
        status: user.status,
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: "Authentication Failed",
      status: 401,
    });
  }
}
