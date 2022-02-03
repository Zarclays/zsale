
import { useEffect } from "react";
import { useConnect, useAccount } from "wagmi";
import { Modal, Button, Box, Typography, Avatar } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

interface Props {
  open: boolean;
  setOpen: (showWalletOptions: boolean) => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function WalletOptionsModal(props: Props) {
  const { open, setOpen } = props;

  const [{ data: connectData, loading: connectDataLoading, error }, connect] =
    useConnect();
  const [{ data: accountData }] = useAccount();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    accountData && setOpen(false);
  }, [accountData, setOpen]);

  return <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Choose a Wallet
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>

        {connectData.connectors.map((c) => (
          <div key={c.id} className="mb-2 ml-2 mr-2 w-80">
            <LoadingButton 
              variant="outlined"
              loading={connectDataLoading}
              // width={80}
              // disabled={!c.ready}
              onClick={() => connect(c)}
            >
              <>
                <div className="mr-3">
                  <Avatar alt={c.name} src={`/images/${c.id}.svg`} />
                  
                </div>
                {`${c.name}${!c.ready ? " (unsupported)" : ""}`}
              </>
            </LoadingButton>
          </div>
        ))}
        {error && (
          <div className="ml-2 text-red-500">
            {error?.message ?? "Failed to connect"}
          </div>
        )}
      </Box>
    </Modal>

    // <>
    //   <div className="fixed inset-0 z-50 flex items-center justify-center">
    //     <div className="relative w-auto max-w-3xl mx-auto my-6">
    //       <div className="relative flex flex-col bg-white border-0 rounded-lg shadow-lg">
    //         <div className="flex items-center justify-around p-5 mb-4">
              
    //           <h3 className="text-3xl font-semibold text-left">
    //             Choose a Wallet
    //           </h3>
    //         </div>

    //         {connectData.connectors.map((c) => (
    //           <div key={c.id} className="mb-2 ml-2 mr-2 w-80">
    //             <Button
    //               loading={connectDataLoading}
    //               width={80}
    //               disabled={!c.ready}
    //               onClick={() => connect(c)}
    //             >
    //               <>
    //                 <div className="mr-3">
    //                   <Image
    //                     src={`/images/${c.id}.svg`}
    //                     alt={c.name}
    //                     height={32}
    //                     width={32}
    //                   />
    //                 </div>
    //                 {`${c.name}${!c.ready ? " (unsupported)" : ""}`}
    //               </>
    //             </Button>
    //           </div>
    //         ))}
    //         {error && (
    //           <div className="ml-2 text-red-500">
    //             {error?.message ?? "Failed to connect"}
    //           </div>
    //         )}

    //         <div className="flex items-center justify-end p-3 mt-1">
    //           <button
    //             className="px-6 py-2 mb-1 text-sm font-semibold text-red-500 uppercase"
    //             type="button"
    //             onClick={() => setOpen(false)}
    //           >
    //             Cancel
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    // </>
  
}
