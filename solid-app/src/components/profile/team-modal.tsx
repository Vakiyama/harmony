import ModalOption from "../shared/modal-option";

interface ModalProps {
  onClose?: () => void;
}

export default function TeamModal(props: ModalProps) {
  const handleClose = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  return (
    <div
      class="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        class="flex flex-col w-full bg-white rounded-t-[50px] p-[22px] items-center gap-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button class="flex items-center mb-6 z-10" onClick={handleClose}>
          <svg
            width="122"
            height="2"
            viewBox="0 0 122 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              width="121"
              height="2"
              rx="1"
              fill="#1E1E1E"
              fill-opacity="0.5"
            />
          </svg>
        </button>
        <ModalOption
          title="Join a Team"
          description="Join an existing team"
          link="/profile/join-team/"
          svg={
            <svg
              width="12"
              height="19"
              viewBox="0 0 12 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.2908 8.39624C11.9011 9.00659 11.9011 9.9978 11.2908 10.6082L3.47827 18.4207C2.86792 19.031 1.87671 19.031 1.26636 18.4207C0.656006 17.8103 0.656006 16.8191 1.26636 16.2087L7.97534 9.49975L1.27124 2.79077C0.660889 2.18042 0.660889 1.18921 1.27124 0.578857C1.88159 -0.0314941 2.8728 -0.0314941 3.48315 0.578857L11.2957 8.39136L11.2908 8.39624Z"
                fill="#7859EA"
              />
            </svg>
          }
        />
        <ModalOption
          title="Create a New Team"
          description="Description here"
          link="/team/1"
          svg={
            <svg
              width="12"
              height="19"
              viewBox="0 0 12 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.2908 8.39624C11.9011 9.00659 11.9011 9.9978 11.2908 10.6082L3.47827 18.4207C2.86792 19.031 1.87671 19.031 1.26636 18.4207C0.656006 17.8103 0.656006 16.8191 1.26636 16.2087L7.97534 9.49975L1.27124 2.79077C0.660889 2.18042 0.660889 1.18921 1.27124 0.578857C1.88159 -0.0314941 2.8728 -0.0314941 3.48315 0.578857L11.2957 8.39136L11.2908 8.39624Z"
                fill="#7859EA"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
}
