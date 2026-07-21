export interface FaqItem {
  id: string;
  questionKey: FaqTranslationKey;
  answerKey: FaqTranslationKey;
  [key: string]: string | number | undefined;
}
import en from "../../messages/en.json";

type FaqMessages = typeof en.Faq;
export type FaqTranslationKey = keyof FaqMessages;

const faqData: FaqItem[] = [
  {
    id: "item-1",
    questionKey: "faq_question_1",
    answerKey: "faq_answer_1",
  },
  {
    id: "item-2",
    questionKey: "faq_question_2",
    answerKey: "faq_answer_2",
  },
  {
    id: "item-3",
    questionKey: "faq_question_3",
    answerKey: "faq_answer_3",
  },
  {
    id: "item-4",
    questionKey: "faq_question_4",
    answerKey: "faq_answer_4",
  },
  {
    id: "item-5",
    questionKey: "faq_question_5",
    answerKey: "faq_answer_5",
  },
];

export default faqData;
