import bcrypt from "bcrypt";

export const signup = async (account: string, password: string, repo: AuthRepository): Promise<boolean> => {

    const cipher = await bcrypt.hash(password, 10);
    const result = await repo.addUser(account, cipher);

    return !!result;
};

export interface AuthRepository {
    addUser(account: string, password: string): Promise<string | undefined>;
}

export const validate = async (account: string, password: string, getInfos: GetAccountInfos): Promise<boolean> => {
    const infos = await getInfos();
    const info = infos.find(info => info.account === account);
    if (!info) {
        return false;
    }
    return await bcrypt.compare(password, info.password);
};

export type GetAccountInfos = () => Promise<{ account: string, password: string; }[]>;