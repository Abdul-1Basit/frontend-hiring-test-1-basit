export const BASE_URL = "https://frontend-test-api.aircall.io";

export const endpoints=  {
	signinUrl: `/auth/login`,
     callsPage:(offset:number,limit:number)=> `/calls?offset=${offset}&limit=${limit}`,
     refreshToken: `/auth/refresh-token`,
     addNote:(id:string)=> `/calls/${id}/note`,
     archive: (id: string) => `/calls/${id}/archive`,
     getSingleCall: (id: string) => `/calls/${id}`,
};
