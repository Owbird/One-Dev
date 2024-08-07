// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {data} from '../models';

export function ChangeBranch(arg1:string,arg2:string):Promise<void>;

export function CloneRepo(arg1:string,arg2:string):Promise<void>;

export function CreateCommit(arg1:data.CreateCommit):Promise<void>;

export function GetAppState():Promise<data.AppState>;

export function GetCommitDiff(arg1:string,arg2:string,arg3:string):Promise<Array<data.CommitDiff>>;

export function GetDirectories(arg1:string,arg2:boolean):Promise<Array<data.Directory>>;

export function GetFileSystems():Promise<Array<data.DiskStats>>;

export function GetGitDirs():Promise<Array<data.File>>;

export function GetGitTokens():Promise<Array<string>>;

export function GetGitUser():Promise<data.GitUser>;

export function GetIndexedRepos():Promise<Array<data.File>>;

export function GetRemoteRepoBranches(arg1:string):Promise<Array<string>>;

export function GetRemoteRepos():Promise<Array<data.RemoteRepo>>;

export function GetRepo(arg1:string):Promise<data.Repo>;

export function GetRepoRemoteURL(arg1:string):Promise<string>;

export function GetSettings():Promise<data.OneJson>;

export function GetSystemProcesses():Promise<Array<data.Process>>;

export function GetSystemResources():Promise<data.SystemResources>;

export function GetUserMeta():Promise<data.UserMeta>;

export function GetWakaToday():Promise<string>;

export function KillProcess(arg1:number):Promise<void>;

export function Notify(arg1:string):Promise<void>;

export function OpenFile(arg1:string):Promise<void>;

export function PullFromOrigin(arg1:string):Promise<void>;

export function PushToOrigin(arg1:string):Promise<void>;

export function SaveAppState(arg1:data.AppState):Promise<void>;

export function SaveSettings(arg1:data.OneJson):Promise<void>;
