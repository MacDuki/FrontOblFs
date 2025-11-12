import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DarkVeil from "../Effects/DarkVeil.effect.jsx";
import ReviewsList from "./ReviewsList";

function MyReviewsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <DarkVeil speed={1.2} hueShift={221} />
      <button
        className="cursor-pointer absolute top-5 left-5 text-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 p-2 transition-all hover:scale-110 hover:bg-white/20"
        onClick={() => navigate("/home")}
      >
        <IoIosArrowBack size={24} className="text-white transition-all hover:scale-110" />
      </button>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">{t('reviews.title')}</h1>
            <p className="text-gray-400 mt-2">{t('reviews.allYourReviews')}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <ReviewsList />
          </div>
        </div>
      </div>
    </>
  );
}

export default MyReviewsPage;
