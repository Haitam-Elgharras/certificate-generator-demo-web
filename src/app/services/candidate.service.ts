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

  // getCandidates(name: string ="", page: number = 1, size: number = 2) {
  //   return this.http.get<Candidate[]>(this.baseUrl + `/search?name=${name}&page=${page}&size=${size}`, {observe: 'response'});
  // }

  getCandidates() {
    return this.http.get(this.baseUrl, {observe: 'response'});
  }

  getCandidateById(id: number) {
    return this.http.get(this.baseUrl + '/' + id);
  }

  createCandidate(candidate: Candidate) {
    return this.http.post(this.baseUrl , candidate);
  }

  updateCandidate(id: number, candidate: Candidate) {
    return this.http.put(this.baseUrl + '/' + id, candidate);
  }

  deleteCandidate(id: number) {
    return this.http.delete(this.baseUrl + '/' + id);
  }
}
