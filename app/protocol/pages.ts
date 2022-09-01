namespace Pages {
  export type RequestContentPage = {
    id?: number;
    title: string;
    text: string;
  };

  export type ResponsePage = {
    id: number;
    title: string;
    text: string;
    created: string;
    updated: string;
  };

  export type RequestContent = Array<RequestContentPage>;
  export type Response = Array<ResponsePage>;
}

export default Pages;
