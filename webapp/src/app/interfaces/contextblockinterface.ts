export interface Attachment {
    fileName: string;        
    originalFileName: string;
}
export interface Contextblockinterface {
    _id?: string;               
    panel: string;              
    subPanel?: string | null;   
    content: string;            
    volunteerAccess: boolean;   
    includeAttachments?: boolean;
    attachments?: Attachment[]; 
}
