import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getTransformedCharities } from "@/data/charityTransform";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const ImportCharities = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [progress, setProgress] = useState(0);

  const handleImport = async () => {
    setIsImporting(true);
    setResult(null);
    setProgress(0);

    try {
      const charities = getTransformedCharities();
      let successCount = 0;
      let errorCount = 0;

      // Insert in batches of 10
      const batchSize = 10;
      for (let i = 0; i < charities.length; i += batchSize) {
        const batch = charities.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from("charities")
          .upsert(batch, { 
            onConflict: "name",
            ignoreDuplicates: false 
          });

        if (error) {
          console.error("Batch insert error:", error);
          errorCount += batch.length;
        } else {
          successCount += batch.length;
        }

        setProgress(Math.round(((i + batch.length) / charities.length) * 100));
      }

      setResult({
        success: errorCount === 0,
        message: `Imported ${successCount} charities. ${errorCount > 0 ? `${errorCount} failed.` : ""}`,
      });
    } catch (error) {
      console.error("Import error:", error);
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-[#F8FAFC] min-h-[calc(100vh-4rem)]">
        <div className="container max-w-xl py-16">
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <h1 className="font-display text-2xl font-bold text-[#1a365d] mb-4">
              Import Charity Data
            </h1>
            <p className="text-[#6B7280] mb-8">
              This will import 71 charities from the JSON file into the database.
            </p>

            {isImporting && (
              <div className="mb-6">
                <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-[#4A90D9] rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-[#6B7280]">{progress}% complete</p>
              </div>
            )}

            {result && (
              <div className={`mb-6 p-4 rounded-lg ${result.success ? "bg-green-50" : "bg-red-50"}`}>
                <div className="flex items-center justify-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <p className={result.success ? "text-green-700" : "text-red-700"}>
                    {result.message}
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={handleImport}
              disabled={isImporting}
              className="bg-[#4A90D9] hover:bg-[#3d7fc4] text-white px-8"
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                "Start Import"
              )}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ImportCharities;
