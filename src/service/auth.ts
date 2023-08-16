export const signup = async (account: string, password: string, repo: AuthRepository)
    : Promise<SignupSuccess | SignupFailure> => {
    const result = await repo.addUser(account, password);
    return result ? new SignupSuccess() : new SignupFailure();
};

export interface AuthRepository {
    addUser(account: string, password: string): Promise<string | undefined>;
}

export class SignupSuccess { }

export class SignupFailure extends Error { }