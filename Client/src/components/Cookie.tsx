import { useEffect } from "react";

function Cookie() {
    useEffect(() => {
      const consent = localStorage.getItem("cookieConsent");
      if (!consent) {
        const dialog = document.getElementById("my_modal_5");
        if (dialog instanceof HTMLDialogElement) {
          dialog.showModal();
        }
      }
    }, []);

    const handleAccept = () => {
      localStorage.setItem("cookieConsent", "true"); 
    };

    const handleDecline = () => {
      localStorage.setItem("cookieConsent", "false");
    };

    return (
      <div>
        <dialog id="my_modal_5" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">
              We use cookies to improve your experience on our site. By using
              our site, you accept our use of cookies
            </p>
            <div className="buttons">
              <form className="flex justify-evenly">
                <button
                  className="btn btn-active btn-primary"
                  onClick={handleAccept}
                >
                  Accept
                </button>
                <button
                  className="btn btn-active btn-primary"
                  onClick={handleDecline}
                >
                  Decline
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    );
}

export default Cookie;
