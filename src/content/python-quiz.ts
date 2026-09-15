import preguntas from "@/content/python-quiz.json";

export type PreguntaQuizPython = {
  id: string;
  sesion: 1 | 2 | 3 | 4;
  tema: string;
  pregunta: string;
  opciones: [string, string, string, string];
  correcta: 0 | 1 | 2 | 3;
  explicacion: string;
};

export const preguntasQuizPython = preguntas as PreguntaQuizPython[];
