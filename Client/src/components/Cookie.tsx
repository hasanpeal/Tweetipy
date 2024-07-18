import { useEffect } from "react";
import axios from "axios";

function Cookie() {
    useEffect(() => {
      const fetchConsent = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER}/getCookieConsent`,
            { withCredentials: true }
          );
          if (response.data.consent === undefined) {
            const dialog = document.getElementById("my_modal_5");
            if (dialog instanceof HTMLDialogElement) {
              dialog.showModal();
            }
          }
        } catch (error) {
          console.error("Error fetching cookie consent:", error);
        }
      };
      fetchConsent();
    }, []);

    const handleAccept = async () => {
      localStorage.setItem("cookieConsent", "true");
      await updateCookieConsent(true);
      const dialog = document.getElementById("my_modal_5");
      if (dialog instanceof HTMLDialogElement) {
        dialog.close();
      }
    };

    const handleDecline = async () => {
      localStorage.setItem("cookieConsent", "false");
      await updateCookieConsent(false);
      const dialog = document.getElementById("my_modal_5");
      if (dialog instanceof HTMLDialogElement) {
        dialog.close();
      }
    };

    const updateCookieConsent = async (consent: boolean) => {
      try {
        await axios.post(
          `${import.meta.env.VITE_SERVER}/updateCookieConsent`,
          { consent },
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Error updating cookie consent:", error);
      }
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
            <p className="py-4">
              We use cookies to improve your experience on our site. By using
              our site, you accept our use of cookies
            </p>
            <div className="buttons flex justify-center gap-5 mt-2">
              <div>
                <button
                  className="btn btn-active btn-primary"
                  onClick={handleAccept}
                >
                  Accept
                </button>
              </div>
              <div>
                <button
                  className="btn btn-outline btn-primary"
                  onClick={handleDecline}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </dialog>
      </div>
    );
}

export default Cookie;
