import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Candidate } from '../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  
  baseUrl = environment.baseUrl + '/candidates';

  constructor(private http: HttpClient) { }

  getCandidates() {
    return this.http.get<Candidate[]>(this.baseUrl);
  }

  getCandidateById(id: number) {
    return this.http.get(this.baseUrl + '/' + id);
  }

  createCandidate(candidate: Candidate) {
    return this.http.post(this.baseUrl , candidate);
  }

  updateCandidate(candidate: Candidate) {
    return this.http.put(this.baseUrl, candidate);
  }

  deleteCandidate(id: number) {
    return this.http.delete(this.baseUrl + '/' + id);
  }
}
