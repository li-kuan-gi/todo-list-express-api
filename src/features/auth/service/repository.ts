export interface AuthRepository {
    addUser(account: string, password: string): Promise<boolean>;
}