// app/api/get-resume-score/route.tsx
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";

async function extractTextFromPDF(base64Content: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    const pdfBuffer = Buffer.from(base64Content, "base64");

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      try {
        const text = pdfData.Pages.map((page: any) =>
          page.Texts.map((text: any) => decodeURIComponent(text.R[0].T)).join(
            " "
          )
        ).join("\n");

        resolve(text);
      } catch (error) {
        reject(error);
      }
    });

    pdfParser.on("pdfParser_dataError", (error) => {
      reject(error);
    });

    pdfParser.parseBuffer(pdfBuffer);
  });
}

export async function POST(request: NextRequest) {
  try {
    const { base64Content, desc } = await request.json();

    if (!base64Content || !desc) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Extract text from PDF
    const extractedText = await extractTextFromPDF(base64Content);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // Analyze the extracted text
    const prompt = `Analyze this resume against the job description as an ATS expert. Return only a valid JSON response with no markdown formatting or code blocks.
    Give score like SCORE:75 or unable to score then Score:N/A.Please give the respective sections according to the jobdescription Provided and Resume content (Remember this )
    Job Description: ${desc}
    Resume Content: ${extractedText}
    
    Return the analysis in this exact JSON format without any code blocks or additional text:
    {
      "sections": [
        {
          "title": "ATS Match Score",
          "content": "SCORE% \\n\\nScore Breakdown:\\n• Reason 1\\n• Reason 2\\n\\nKey Matches:\\n• Match 1\\n• Match 2\\n\\nQuick Wins:\\n• Win 1\\n• Win 2"
        },
        {
          "title": "Missing Keywords",
          "content": "Critical Keywords Missing:\\n• Keyword 1 - Location 1\\n• Keyword 2 - Location 2\\n\\nTechnical Terms Needed:\\n• Term 1 - Context 1\\n• Term 2 - Context 2\\n\\nAction Items:\\n• Action 1\\n• Action 2"
        },
        {
          "title": "Content Optimization",
          "content": "Strong Matches:\\n• Match 1\\n• Match 2\\n\\nEnhancement Areas:\\n• Current 1 → Improved 1\\n• Current 2 → Improved 2\\n\\nAdd These Points:\\n• Point 1\\n• Point 2"
        },
        {
          "title": "Skills Gap Analysis",
          "content": "Matching Skills:\\n• Skill 1 - Demo 1\\n• Skill 2 - Demo 2\\n\\nCritical Gaps:\\n• Gap 1 - Solution 1\\n• Gap 2 - Solution 2\\n\\nQuick Skill Additions:\\n• Addition 1\\n• Addition 2"
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response text
    let cleanJson = text
      .replace(/```json\n?|\n?```/g, "") // Remove code blocks
      .replace(/[\u0000-\u001F]+/g, "") // Remove control characters
      .replace(/\n/g, "\\n") // Escape newlines
      .trim();

    // Handle possible multiple JSON objects
    if (cleanJson.includes("}{")) {
      cleanJson = cleanJson.split("}{")[0] + "}";
    }

    const analysisResult = JSON.parse(cleanJson);

    if (!analysisResult.sections || !Array.isArray(analysisResult.sections)) {
      throw new Error("Invalid response structure");
    }

    // Unescape newlines in content
    analysisResult.sections = analysisResult.sections.map((section: any) => ({
      ...section,
      content: section.content.replace(/\\n/g, "\n"),
    }));

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
