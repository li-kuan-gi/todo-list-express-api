import bcrypt from "bcrypt";

export const signup = async (account: string, password: string, repo: AuthRepository)
    : Promise<SignupSuccess | SignupFailure> => {

    const cipher = await bcrypt.hash(password, 10);
    const result = await repo.addUser(account, cipher);

    return result ? new SignupSuccess() : new SignupFailure();
};

export interface AuthRepository {
    addUser(account: string, password: string): Promise<string | undefined>;
}

export class SignupSuccess { }

export class SignupFailure extends Error { }