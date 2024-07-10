import { Candidate } from "./candidate.model";


export interface CandidateState {
    candidates: Candidate[];
    keyword: string;
    totalPages: number;
    pageSize: number;
    currentPage: number;
    totalCandidates: number;
    status: string;
    error: any;
}