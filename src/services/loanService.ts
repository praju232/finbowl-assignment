import { api } from "./api";
import type { Loan } from "../types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchLoans = async () => {
  await sleep(700);
  const { data } = await api.get<Loan[]>("/loans.json");
  return data;
};

export const fetchLoanById = async (id: string) => {
  const loans = await fetchLoans();
  return loans.find((loan) => loan.id === id) ?? null;
};
