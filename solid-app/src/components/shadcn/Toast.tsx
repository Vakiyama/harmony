import { toaster } from "@kobalte/core";
import { Button } from "~/components/ui/button";
import {
  Toast,
  ToastContent,
  ToastDescription,
  ToastProgress,
  ToastTitle,
} from "~/components/ui/toast";

type ToastProps = {
  title: string;
  description: string;
  progress?: boolean;
}

type ToastButtonProps = ToastProps & {
  buttonLabel: string;
};

const ToastComponent = ({ title, description, progress, buttonLabel }: ToastButtonProps) => {
  const showToast = ({ title, description, progress }: ToastProps) => {
    toaster.show((props) => (
      <Toast toastId={props.toastId}>
        <ToastContent>
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{description}</ToastDescription>
        </ToastContent>
        {progress && <ToastProgress />}
      </Toast>
    ));
  };

  return (
    <Button
      variant="outline"
      onClick={() =>
        showToast({
          title,
          description,
          progress,
        })
      }
    >
      {buttonLabel}
    </Button>
  );
};

export default ToastComponent;
