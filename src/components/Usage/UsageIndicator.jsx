import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMyReviews, fetchMyReviews } from "../../features/reviews.slice";
import UsageIndicatorPlus from "./UsageIndicatorPlus";
import UsageIndicatorPremium from "./UsageIndicatorPremium";

function UsageIndicator() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  const myReviews = useSelector(selectMyReviews);
  
  const planObj = profile?.plan;
  const planName = planObj?.name || "plus";
  const plan = planName.charAt(0).toUpperCase() + planName.slice(1).toLowerCase();

  useEffect(() => {
    dispatch(fetchMyReviews());
  }, [dispatch]);

  const reviewCount = useMemo(() => {
    return myReviews?.length || 0;
  }, [myReviews]);

  if (!profile) {
    return null;
  }

  const componentKey = `usage-${plan}-${reviewCount}`;

  if (plan === "Premium") {
    return <UsageIndicatorPremium key={componentKey} reviewCount={reviewCount} />;
  }

  return <UsageIndicatorPlus key={componentKey} reviewCount={reviewCount} />;
}

export default UsageIndicator;
