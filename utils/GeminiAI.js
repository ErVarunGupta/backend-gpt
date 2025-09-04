import dotenv from 'dotenv';
dotenv.config();

export const getGeminiAIResponse = async(req, res)=>{
    const {prompt} = req.body;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'X-goog-api-key': process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
            contents:[{
                role: 'user',
                parts:[{text: prompt}]
            }]
        })
    }

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', options);
        const data = await response.json();
        res.send(data.candidates[0].content.parts[0].text);
    } catch (error) {
        res.send(error);
    }
}

