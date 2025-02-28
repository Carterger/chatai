async function getAIResponse(message) {
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: message,
                parameters: {
                    max_new_tokens: 100,
                    temperature: 0.7,
                    top_p: 0.9
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data.generated_text || "Mistral-7B не ответил.";
    } catch (error) {
        console.error('Ошибка:', error);
        return `Ошибка: ${error.message}. Проверь консоль.`;
    }
}
