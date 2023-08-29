export interface AuthView {
    getPassword: (account: string) => Promise<string | undefined>;
}