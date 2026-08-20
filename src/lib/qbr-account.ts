/* The QBR path reads the same account the rest of the experience is focused on.
 * Every QBR data set is personalized once per account and memoized. */

import * as QbrNs from "./qbr-data";
import { useAccountData } from "./account-context";

const QBR_BUNDLE = { ...QbrNs };

export function useQbrData() {
  return useAccountData(QBR_BUNDLE);
}
