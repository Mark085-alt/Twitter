

export const getPostTime = (postTime) => {
    const now = new Date();
    const timeDifference = now - new Date(postTime);
    const secondsDifference = Math.floor(timeDifference / 1000);

    if (secondsDifference >= 24 * 60 * 60) {
        // Older than 24 hours, return date and starting three letters of month name
        const date = new Date(postTime);
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        return `${day} ${month}`;
    } else if (secondsDifference >= 60 * 60) {
        // Older than 1 hour, return hours
        const hours = Math.floor(secondsDifference / (60 * 60));
        return `${hours}h`;
    } else if (secondsDifference >= 60) {
        // Older than 1 minute, return minutes
        const minutes = Math.floor(secondsDifference / 60);
        return `${minutes}m`;
    } else {
        // Less than 1 minute, return seconds
        return `${secondsDifference}s`;
    }
};


export const getProfileTime = (profileTime) => {

    const profileDate = new Date(profileTime);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const shortMonthName = monthNames[profileDate.getMonth()];

    const profileTimeString = `${shortMonthName} ${profileDate.getFullYear()}`;

    return profileTimeString;
}

