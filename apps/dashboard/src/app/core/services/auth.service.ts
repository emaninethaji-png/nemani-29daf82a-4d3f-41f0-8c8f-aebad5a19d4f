import { Injectable } from "@angular/core"
import type { HttpClient } from "@angular/common/http"
import type { Router } from "@angular/router"
import { BehaviorSubject, type Observable } from "rxjs"
import { tap, map } from "rxjs/operators"
import type { AuthTokens, JwtPayload, LoginDto } from "@task-mgmt/data"

@Injectable({ providedIn: "root" })
export class AuthService {
  private apiUrl = "http://localhost:3000/api"
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken())
  public token$ = this.tokenSubject.asObservable()

  private userSubject = new BehaviorSubject<JwtPayload | null>(null)
  public user$ = this.userSubject.asObservable()

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadUserFromToken()
  }

  login(credentials: LoginDto): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem("access_token", response.accessToken)
        this.tokenSubject.next(response.accessToken)
        this.loadUserFromToken()
      }),
    )
  }

  logout(): void {
    localStorage.removeItem("access_token")
    this.tokenSubject.next(null)
    this.userSubject.next(null)
    this.router.navigate(["/auth/login"])
  }

  getToken(): string | null {
    return localStorage.getItem("access_token")
  }

  isAuthenticated(): Observable<boolean> {
    return this.token$.pipe(map((token) => !!token))
  }

  private loadUserFromToken(): void {
    const token = this.getToken()
    if (token) {
      try {
        const payload = this.parseToken(token)
        this.userSubject.next(payload)
      } catch {
        this.logout()
      }
    }
  }

  private parseToken(token: string): JwtPayload {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  }
}
