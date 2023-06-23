// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {data} from '../models';

export function ChangeBranch(arg1:string,arg2:string):Promise<void>;

export function GetGitDirs():Promise<Array<data.File>>;

export function GetGitToken():Promise<string>;

export function GetGitTokens():Promise<Array<string>>;

export function GetRemoteRepos(arg1:string):Promise<data.RemoteRepo>;

export function GetRepo(arg1:string):Promise<data.Repo>;

export function GetSystemStat():Promise<data.SystemStats>;

export function GetWakaToday():Promise<string>;

export function KillProcess(arg1:number):Promise<void>;

export function Notify(arg1:string):Promise<void>;

export function SaveGitToken(arg1:string):Promise<void>;
