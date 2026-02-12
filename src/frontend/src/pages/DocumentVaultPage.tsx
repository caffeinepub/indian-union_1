import { useState } from 'react';
import { useListDocuments, useUploadDocument, useDeleteDocument, useDownloadDocument } from '../hooks/useQueries';
import { FolderLock, Upload, Download, Trash2, Loader2, AlertCircle, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ExternalBlob } from '../backend';

export default function DocumentVaultPage() {
  const { data: documents, isLoading, error } = useListDocuments();
  const uploadDocument = useUploadDocument();
  const deleteDocument = useDeleteDocument();
  const downloadDocument = useDownloadDocument();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await uploadDocument.mutateAsync({
        name: selectedFile.name,
        blob,
      });

      setSelectedFile(null);
      setUploadProgress(0);
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      console.error('Failed to upload document:', err);
    }
  };

  const handleDownload = async (documentName: string) => {
    setDownloadingDoc(documentName);
    setDownloadError(null);
    
    try {
      const { blob, name } = await downloadDocument.mutateAsync(documentName);
      
      // Get bytes from ExternalBlob and create a browser Blob
      const bytes = await blob.getBytes();
      const browserBlob = new Blob([bytes]);
      
      // Create object URL and trigger download
      const url = URL.createObjectURL(browserBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up object URL
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Failed to download document:', err);
      const errorMsg = err.message === 'Document not found' 
        ? `Document "${documentName}" was not found. It may have been deleted.`
        : 'Failed to download document. Please try again.';
      setDownloadError(errorMsg);
    } finally {
      setDownloadingDoc(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteDocument.mutateAsync(deleteTarget);
      setDeleteTarget(null);
    } catch (err: any) {
      console.error('Failed to delete document:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12">
        <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl p-8 text-center">
          <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
          <p className="text-foreground/70">Loading document vault...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load documents';
    const isAuthError = errorMessage.includes('Unauthorized') || errorMessage.includes('permission');
    
    return (
      <div className="max-w-6xl mx-auto py-12">
        <div className="bg-card/50 backdrop-blur-sm border border-destructive/30 rounded-xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <h2 className="text-2xl font-bold text-destructive">
              {isAuthError ? 'Access Denied' : 'Error Loading Documents'}
            </h2>
          </div>
          <p className="text-foreground/70">
            {isAuthError 
              ? 'You do not have permission to access the document vault. Please ensure you are signed in with a registered account.'
              : errorMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border border-gold/30 rounded-xl shadow-2xl p-8">
        <div className="flex items-center gap-4">
          <div className="bg-gold p-4 rounded-full">
            <FolderLock className="w-8 h-8 text-carbon" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gold">Document Vault</h1>
            <p className="text-foreground/60 text-lg mt-1">Secure storage for your documents</p>
          </div>
        </div>
      </div>

      {/* Download Error Alert */}
      {downloadError && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-destructive font-semibold mb-1">Download Failed</h3>
              <p className="text-destructive/90 text-sm">{downloadError}</p>
              <Button
                onClick={() => setDownloadError(null)}
                variant="outline"
                size="sm"
                className="mt-3 border-destructive/30 hover:bg-destructive/10 text-destructive"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gold/10 to-transparent border-b border-gold/20 p-6">
          <h2 className="text-2xl font-bold text-gold flex items-center gap-2">
            <Upload className="w-6 h-6" />
            Upload Document
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <Label htmlFor="file-upload" className="text-foreground/80">Select File</Label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileSelect}
              className="mt-2 block w-full text-sm text-foreground/70
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-gold file:text-carbon
                hover:file:bg-gold-light
                file:cursor-pointer cursor-pointer
                bg-carbon-dark/50 border border-gold/20 rounded-lg p-2"
            />
          </div>

          {selectedFile && (
            <div className="bg-carbon-dark/50 border border-gold/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gold" />
                  <span className="text-foreground font-medium">{selectedFile.name}</span>
                </div>
                <span className="text-foreground/60 text-sm">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </span>
              </div>
              
              {uploadDocument.isPending && uploadProgress > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-foreground/60 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-carbon-darker rounded-full h-2">
                    <div
                      className="bg-gold h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadDocument.isPending}
            className="w-full bg-gold hover:bg-gold-light text-carbon font-semibold"
          >
            {uploadDocument.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </>
            )}
          </Button>

          {uploadDocument.isError && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
              Failed to upload document. Please try again.
            </div>
          )}

          {uploadDocument.isSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-500 text-sm">
              Document uploaded successfully!
            </div>
          )}
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-card/50 backdrop-blur-sm border border-gold/30 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gold/10 to-transparent border-b border-gold/20 p-6">
          <h2 className="text-2xl font-bold text-gold">Your Documents</h2>
          <p className="text-foreground/60 text-sm mt-1">
            {documents?.length || 0} document{documents?.length !== 1 ? 's' : ''} stored
          </p>
        </div>

        <div className="p-6">
          {!documents || documents.length === 0 ? (
            <div className="text-center py-12">
              <FolderLock className="w-16 h-16 text-gold/30 mx-auto mb-4" />
              <p className="text-foreground/60 text-lg">No documents yet</p>
              <p className="text-foreground/40 text-sm mt-2">Upload your first document above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((docName) => (
                <div
                  key={docName}
                  className="bg-carbon-dark/50 border border-gold/20 rounded-lg p-5 hover:border-gold/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="bg-gold/20 p-2 rounded-lg flex-shrink-0">
                        <FileText className="w-5 h-5 text-gold" />
                      </div>
                      <span className="text-foreground font-medium truncate">{docName}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        onClick={() => handleDownload(docName)}
                        disabled={downloadingDoc === docName}
                        variant="outline"
                        size="sm"
                        className="border-gold/30 hover:border-gold/50 hover:bg-gold/10"
                      >
                        {downloadingDoc === docName ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => setDeleteTarget(docName)}
                        variant="outline"
                        size="sm"
                        className="border-destructive/30 hover:border-destructive/50 hover:bg-destructive/10 text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-carbon-dark border-gold/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Delete Document
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/70">
              Are you sure you want to delete "{deleteTarget}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gold/30 hover:bg-gold/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {deleteDocument.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
