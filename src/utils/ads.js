const PREVIEW_REWARDED_DELAY_MS = 2200;

export const AD_PLACEMENTS = {
  REWARDED_REVIVE: 'rewarded_revive',
  REWARDED_DOUBLE_COINS: 'rewarded_double_coins',
  INTERSTITIAL_SESSION_BREAK: 'interstitial_session_break',
  BANNER_RESULT: 'banner_result',
  BANNER_SHOP: 'banner_shop',
};

function getBridge() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.__GENO_ADS_BRIDGE__ || null;
}

export async function initializeAds() {
  const bridge = getBridge();

  if (!bridge?.initialize) {
    return { ready: false, source: 'preview' };
  }

  try {
    await bridge.initialize({ placements: AD_PLACEMENTS });
    return { ready: true, source: 'provider' };
  } catch (error) {
    console.warn('GenoAtlas - Falha iniciando ads:', error);
    return { ready: false, source: 'error' };
  }
}

export async function showRewardedAd({ placement }) {
  const bridge = getBridge();

  if (bridge?.showRewardedAd) {
    try {
      const result = await bridge.showRewardedAd({ placement });
      return {
        completed: !!result?.completed,
        rewardGranted: result?.rewardGranted ?? !!result?.completed,
        source: 'provider',
      };
    } catch (error) {
      console.warn(`GenoAtlas - Rewarded falhou em ${placement}:`, error);
    }
  }

  await new Promise((resolve) => window.setTimeout(resolve, PREVIEW_REWARDED_DELAY_MS));
  return { completed: true, rewardGranted: true, source: 'preview' };
}

export async function showInterstitialAd({ placement }) {
  const bridge = getBridge();

  if (!bridge?.showInterstitialAd) {
    return { shown: false, source: 'preview' };
  }

  try {
    await bridge.showInterstitialAd({ placement });
    return { shown: true, source: 'provider' };
  } catch (error) {
    console.warn(`GenoAtlas - Interstitial falhou em ${placement}:`, error);
    return { shown: false, source: 'error' };
  }
}
