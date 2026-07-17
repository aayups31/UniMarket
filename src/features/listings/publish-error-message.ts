type ListingPublishError = {
  code?: string;
  message?: string;
};

/** Turns database validation into the one next action a seller can take. */
export function publishErrorMessage(error: ListingPublishError) {
  const message = error.message?.toLowerCase() ?? '';

  if (error.code === '42501' || error.code === 'PGRST301') {
    return 'Your seller session could not be verified. Refresh, sign in again, and retry.';
  }

  if (message.includes('wait for every image upload')) {
    return 'One photo did not finish uploading. Remove the photo marked “Needs attention,” then add it again.';
  }

  if (message.includes('between one and six images')) {
    return 'Add at least one finished image before publishing.';
  }

  if (message.includes('image positions')) {
    return 'Your photo order needs attention. Remove the affected photo and add it again before publishing.';
  }

  return 'We could not publish the listing yet. Your work is still saved as a draft.';
}
