import { openAIApiKey } from "utils/env";

export const OpenAIHandler = {
  async transcribe(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-1");

    const transcriptionResponse = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAIApiKey}`,
        },
        body: formData,
      }
    );

    const transcriptionData = await transcriptionResponse.json();
    return transcriptionData.text;
  },

  async getTicketData(
    transcription: string,
    agents: string[],
    ticketsList: string[]
  ) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that creates ticket information from audio transcriptions. Extract a title, description, and suggest a priority (HIGH, MEDIUM, or LOW), and type (TICKET, INCIDENT, REQUEST, PROBLEM, SUGGESTION, OTHER), and assignedTo (this is the from the agents list of the agent that should be assigned to the ticket), based on the content. Format the response as JSON with fields: title, description, priority, type, assignedTo, similarTickets. here are agents description with their ID: ${agents} and here are tickets list with their ID: ${ticketsList} similar can be an array of ticket IDs`,
          },
          {
            role: "user",
            content: `Transcription: ${transcription}`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  },
};
