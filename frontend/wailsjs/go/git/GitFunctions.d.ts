// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {data} from '../models';

export function ChangeBranch(arg1:string,arg2:string):Promise<void>;

export function CloneRepo(arg1:string,arg2:string):Promise<void>;

export function GetGitDirs():Promise<Array<data.File>>;

export function GetGitTokens():Promise<Array<string>>;

export function GetGitUser():Promise<data.GitUser>;

export function GetRemoteRepos():Promise<Array<data.RemoteRepo>>;

export function GetRepo(arg1:string):Promise<data.Repo>;
