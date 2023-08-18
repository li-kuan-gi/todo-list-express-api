import bcrypt from "bcrypt";

export const signup = async (account: string, password: string, repo: AuthRepository): Promise<boolean> => {

    const cipher = await bcrypt.hash(password, 10);
    const result = await repo.addUser(account, cipher);

    return result;
};

export interface AuthRepository {
    addUser(account: string, password: string): Promise<boolean>;
}

export const validate = async (account: string, password: string, getPassword: GetPasswordByAccount): Promise<boolean> => {
    const cipher = await getPassword(account);

    if (!cipher) {
        return false;
    } else {
        return await bcrypt.compare(password, cipher);
    }
};

export type GetPasswordByAccount = (account: string) => Promise<string | undefined>;