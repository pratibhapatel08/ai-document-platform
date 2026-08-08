import { cn } from "@/utils";
import type { UploadStage } from "@/types/document";

interface UploadProgressProps {
  stage: UploadStage;
  progress: number;
  message: string;
  className?: string;
}

const stageSteps: UploadStage[] = ["uploading", "processing", "completed"];

const getStepIndex = (stage: UploadStage): number => {
  if (stage === "failed") return -1;
  if (stage === "idle") return -1;
  if (stage === "completed") return 3;
  if (stage === "processing") return 2;
  return 1;
};

export const UploadProgress = ({ stage, progress, message, className }: UploadProgressProps) => {
  if (stage === "idle") return null;

  const currentStep = getStepIndex(stage);

  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-5", className)}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-900">{message}</p>
        {stage === "uploading" ? (
          <span className="text-sm font-semibold text-blue-600">{progress}%</span>
        ) : null}
      </div>

      {stage === "uploading" ? (
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-3 gap-2">
        {stageSteps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep >= stepNumber;
          const isFailed = stage === "failed";

          return (
            <div key={step} className="text-center">
              <div
                className={cn(
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                  isFailed && stepNumber === currentStep
                    ? "bg-red-100 text-red-700"
                    : isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-400",
                )}
              >
                {stepNumber}
              </div>
              <p className="mt-1 text-xs capitalize text-slate-500">{step}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
