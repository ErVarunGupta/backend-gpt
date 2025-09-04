import { GoogleGenerativeAI } from "@google/generative-ai"

export const GeminiConnection = async(message) =>{
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        // const {prompt} = req.body;
        if(!message){
            res.status(400).json({
                message: 'Prompt is required!',
                success: false
            })
        }
        const model = genAI.getGenerativeModel({model: 'gemini-2.0-flash'})
        const response = await model.generateContent(message);
        const data = response.response.candidates[0].content.parts[0].text;
        
        return data;
    } catch (error) {
        return error.message
    }
}