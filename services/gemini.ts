
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface GroundedResponse {
  text: string;
  sources: GroundingSource[];
}

export class GeminiService {
  private _chat: Chat | null = null;

  private getChat(): Chat {
    if (!this._chat) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      this._chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `אתה יועץ מומחה לזכויות חיילים משוחררים בני העדה הדרוזית. 
        תפקידך לספק מידע מדויק, תומך ומקצועי.
        דבר בעברית, בנימוס ובגובה העיניים.`,
        },
      });
    }
    return this._chat;
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const chat = this.getChat();
      const response = await chat.sendMessage({ message });
      return response.text || "מצטער, חלה שגיאה בעיבוד הבקשה.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "חלה שגיאה בחיבור ליועץ הדיגיטלי. אנא נסה שוב מאוחר יותר.";
    }
  }

  async *sendMessageStream(message: string) {
    try {
      const chat = this.getChat();
      const stream = await chat.sendMessageStream({ message });
      for await (const chunk of stream) {
        yield (chunk as GenerateContentResponse).text || "";
      }
    } catch (error) {
      console.error("Gemini Stream Error:", error);
      yield "חלה שגיאה בתקשורת.";
    }
  }

  async searchRights(query: string): Promise<GroundedResponse> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const structuredPrompt = `ענה על השאלה הבאה בנוגע לזכויות חיילים משוחררים בישראל (דגש על העדה הדרוזית): ${query}
      
      חשוב מאוד: חלק את התשובה שלך למבנה הבא עם הכותרות המדויקות הללו:
      [תקציר מנהלים] - פסקה קצרה וממוקדת.
      [נקודות מרכזיות] - רשימת בולטים של הזכויות החשובות ביותר.
      [הנחיות לביצוע] - מה המשתמש צריך לעשות עכשיו (טפסים, אתרים, פעולות).
      
      השתמש בשפה פשוטה וברורה.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: structuredPrompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "לא נמצא מידע עדכני.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources: GroundingSource[] = chunks
        .filter(chunk => chunk.web)
        .map(chunk => ({
          uri: chunk.web?.uri || '',
          title: chunk.web?.title || 'מקור מידע'
        }));

      return { text, sources };
    } catch (error) {
      console.error("Search Grounding Error:", error);
      return { text: "חלה שגיאה בחיפושי המידע המעודכן.", sources: [] };
    }
  }

  async searchJobs(query: string): Promise<GroundedResponse> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const structuredPrompt = `מצא משרות פנויות ועדכניות בישראל עבור החיפוש הבא: ${query}. 
      החזר רשימה של עד 5 משרות. לכל משרה ציין: כותרת תפקיד, שם החברה (אם ידוע), מיקום, ותיאור קצר מאוד. 
      החזר את התשובה במבנה הבא:
      [משרה]
      כותרת: ...
      חברה: ...
      מיקום: ...
      תיאור: ...
      
      חשוב מאוד: השתמש בכלי החיפוש כדי למצוא משרות אמיתיות מאתרים כמו LinkedIn, Indeed, AllJobs, Drushim וכו'.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: structuredPrompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "לא נמצאו משרות עדכניות.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources: GroundingSource[] = chunks
        .filter(chunk => chunk.web)
        .map(chunk => ({
          uri: chunk.web?.uri || '',
          title: chunk.web?.title || 'מקור המשרה'
        }));

      return { text, sources };
    } catch (error) {
      console.error("Job Search Error:", error);
      return { text: "חלה שגיאה בחיפוש המשרות.", sources: [] };
    }
  }
}

export const geminiService = new GeminiService();
