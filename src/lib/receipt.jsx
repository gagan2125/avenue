import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Svg, G, Path, Defs, ClipPath, Rect } from '@react-pdf/renderer';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = date.toLocaleString('en-US', options);

    // Add the suffix for the day
    const day = date.getDate();
    const suffix = (day) => {
        if (day > 3 && day < 21) return 'th'; // Catch 11th-13th
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    return formattedDate.replace(/(\d+)/, `$&${suffix(day)}`);
};

const formatTime = (dateString) => {
    const date = new Date(dateString);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleString('en-US', options);
};

const Logo = () => (
    <Svg width="177" height="26" viewBox="0 0 177 26">
        <G clipPath="url(#clip0_3029_535)">
            <Path
                d="M0.159951 26.0217C0.0836084 26.0217 0.0454374 25.9833 0.00726612 25.9449C-0.0309051 25.8681 -0.0309051 25.8297 0.00726612 25.7913L13.7489 0.098535C13.7489 0.0601303 13.7871 0.0217209 13.8634 0.0217209H17.5279C17.566 0.0217209 17.6424 0.0601303 17.6805 0.098535L31.3458 25.7913C31.384 25.8297 31.384 25.8681 31.3458 25.9449C31.3077 25.9833 31.2695 26.0217 31.1932 26.0217H25.7347C25.6583 26.0217 25.6202 25.9833 25.582 25.9449L15.8102 7.62586C15.772 7.54905 15.7338 7.54905 15.6575 7.54905C15.6193 7.54905 15.543 7.58745 15.5048 7.62586L5.80929 25.9449C5.77112 25.9833 5.73295 26.0217 5.65661 26.0217H0.159951Z"
                fill="black"
            />
            <Path
                d="M32.0399 0.290558C31.9636 0.136939 32.0017 0.0601273 32.1926 0.0601273H37.7274C37.7656 0.0601273 37.8419 0.0985308 37.8801 0.136936L47.6519 18.4176C47.6901 18.4944 47.7283 18.4944 47.8046 18.4944C47.881 18.4944 47.9191 18.456 47.9573 18.4176L57.7292 0.136936C57.7292 0.0601261 57.8055 0.0601273 57.8818 0.0601273H63.3403C63.493 0.0601273 63.5312 0.136939 63.493 0.290558L49.7895 25.9833C49.7514 26.0217 49.7132 26.0601 49.6369 26.0601H45.9724C45.8961 26.0601 45.8961 26.0217 45.8579 25.9833L32.0399 0.290558Z"
                fill="black"
            />
            <Path
                d="M65.9811 10.5446C65.9811 10.4294 66.0193 10.391 66.1338 10.391H86.8989C87.0134 10.391 87.0898 10.4294 87.0898 10.5446V15.4988C87.0898 15.614 87.0134 15.6524 86.8989 15.6524H71.2487C71.1724 15.6524 71.096 15.6909 71.096 15.8061V20.6067C71.096 20.6835 71.1342 20.7603 71.2487 20.7603H86.9753C87.0516 20.7987 87.0898 20.8371 87.1279 20.8371C87.1661 20.8371 87.1661 20.8755 87.1661 20.9523V25.8681C87.1661 25.9833 87.0898 26.0601 86.9753 26.0601H66.1719C66.0574 26.0601 65.9811 25.9833 65.9811 25.8681V10.5446ZM66.1338 5.20636C66.0193 5.20636 65.9811 5.16796 65.9811 5.05274V0.213745C66.0193 0.0985303 66.0956 0.0217209 66.1719 0.0217209H86.9753C87.0898 0.0601256 87.1661 0.136935 87.1661 0.213745V5.05274C87.1661 5.16796 87.0898 5.24477 86.9753 5.24477H66.1338V5.20636Z"
                fill="black"
            />
            <Path
                d="M91.6774 0.136939C91.6774 0.0601293 91.7155 -0.0166779 91.8301 -0.0166779H97.2885C97.3267 -0.0166779 97.3649 0.0217234 97.4031 0.0217234L114.16 19.1089C114.237 19.1857 114.275 19.1857 114.351 19.1857C114.427 19.1473 114.427 19.1089 114.427 19.0321V0.213747C114.504 0.0985328 114.542 0.0217234 114.618 0.0217234H119.504C119.619 0.0601281 119.695 0.136938 119.695 0.213747V25.8297C119.695 25.9449 119.619 26.0217 119.504 26.0217H113.397C113.359 26.0217 113.32 26.0217 113.282 25.9833C112.061 24.6008 110.648 22.9878 109.007 21.1443C107.595 19.5697 105.915 17.6495 103.93 15.3836C101.945 13.1177 99.6552 10.5062 97.0977 7.54905C97.0595 7.47224 97.0213 7.47224 96.945 7.51064C96.8687 7.54905 96.8687 7.58746 96.8687 7.66427V25.9065C96.8687 26.0217 96.7923 26.0985 96.6396 26.0985H91.8682C91.7537 26.0985 91.7155 26.0601 91.7155 25.9449V0.136939H91.6774Z"
                fill="black"
            />
            <Path
                d="M124.217 0.136939C124.217 0.0601299 124.255 -0.0166772 124.37 -0.0166772H129.294C129.408 -0.0166772 129.447 0.0217252 129.447 0.136939V13.7706C129.447 15.3836 129.676 16.651 130.134 17.5727C130.592 18.4944 131.202 19.1857 131.966 19.6465C132.729 20.1074 133.607 20.4146 134.6 20.5299C135.592 20.6451 136.623 20.7219 137.692 20.7603C138.951 20.7987 140.058 20.7219 141.089 20.4914C142.119 20.261 142.997 19.877 143.723 19.3393C144.448 18.8016 145.02 18.0719 145.44 17.1118C145.86 16.1901 146.051 15.038 146.051 13.617V0.0985382C146.051 0.0217287 146.089 -0.0550842 146.204 -0.0550842H151.128C151.204 -0.0550842 151.281 -0.016676 151.281 0.0985382V13.3098C151.281 15.1148 151.09 16.651 150.708 17.9951C150.326 19.3393 149.792 20.453 149.143 21.3748C148.494 22.2965 147.692 23.0646 146.814 23.679C145.937 24.2935 144.982 24.7544 143.952 25.0616C142.959 25.4073 141.89 25.6377 140.86 25.7529C139.791 25.8681 138.76 25.9449 137.73 25.9449C136.088 25.9449 134.485 25.7913 132.844 25.4457C131.241 25.1 129.79 24.4855 128.492 23.5638C127.194 22.6421 126.164 21.3364 125.362 19.6849C124.561 18.0335 124.179 15.8829 124.179 13.3098V0.136939H124.217Z"
                fill="black"
            />
            <Path
                d="M155.825 10.5446C155.825 10.4294 155.863 10.391 155.978 10.391H176.743C176.858 10.391 176.934 10.4294 176.934 10.5446V15.4988C176.934 15.614 176.858 15.6524 176.743 15.6524H161.093C161.016 15.6524 160.94 15.6909 160.94 15.8061V20.6067C160.94 20.6835 160.978 20.7603 161.093 20.7603H176.781C176.858 20.7987 176.896 20.8371 176.934 20.8371C176.972 20.8371 176.972 20.8755 176.972 20.9523V25.8681C176.972 25.9833 176.896 26.0601 176.781 26.0601H156.016C155.902 26.0601 155.825 25.9833 155.825 25.8681V10.5446ZM156.016 5.20636C155.902 5.20636 155.863 5.16796 155.863 5.05274V0.213745C155.902 0.0985303 155.978 0.0217209 156.054 0.0217209H176.858C176.972 0.0601256 177.048 0.136935 177.048 0.213745V5.05274C177.048 5.16796 176.972 5.24477 176.858 5.24477H156.016V5.20636Z"
                fill="black"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_3029_535">
                <Rect width="177" height="26" fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
);

// ... existing Logo component code ...

// Add QR Code component
const QRCode = () => (
    <Svg width="100" height="100" viewBox="0 0 100 100">
        {/* This is a placeholder - you'll need to use an actual QR code generator library 
            like 'qrcode' to generate the real SVG path data for your QR codes */}
        <Rect x="0" y="0" width="100" height="100" fill="black" />
    </Svg>
);

const styles = StyleSheet.create({
    page: {
        padding: '40 30',
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1pt solid black',
        paddingBottom: 10,
        marginBottom: 15,
    },
    headerLeft: {
        width: 100,
    },
    headerRight: {
        width: 50,
    },
    bookingInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    bookingId: {
        fontSize: 11,
        fontWeight: 'normal',
    },
    dateTime: {
        fontSize: 11,
        textAlign: 'right',
        fontWeight: 'bold',
    },
    movieTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    movieInfo: {
        fontSize: 11,
        marginBottom: 2,
    },
    theaterInfo: {
        fontSize: 11,
        marginBottom: 2,
        lineHeight: 1.3,
    },
    screenInfo: {
        fontSize: 11,
        marginTop: 10,
        marginBottom: 2,
    },
    seatInfo: {
        fontSize: 11,
        marginBottom: 15,
    },
    dividerSolid: {
        borderBottom: '1pt solid black',
        marginVertical: 15,
    },
    dividerSolidBody: {
        borderBottom: '1pt solid black',
        marginVertical: 15,
        marginRight: -120
    },
    dividerDashed: {
        borderBottom: '1pt dashed #000',
        marginVertical: 10,
    },
    dividerDashedBody: {
        borderBottom: '1pt dashed #000',
        marginVertical: 10,
        marginRight: -120
    },
    orderSummaryTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 11,
        marginBottom: 3,
    },
    summaryLabel: {
        flex: 1,
    },
    summaryValue: {
        textAlign: 'right',
        width: 100,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 11,
        fontWeight: 'bold',
        marginTop: 5,
    },
    bookingDetails: {
        fontSize: 11,
        marginTop: 10,
        marginBottom: 3,
    },
    importantNotes: {
        marginTop: 15,
    },
    notesTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    noteText: {
        fontSize: 9,
        marginBottom: 4,
        lineHeight: 1.3,
    },
    mainContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contentLeft: {
        flex: 1,
        paddingRight: 20,
    },
    qrCode: {
        width: 100,
        height: 100,
        marginLeft: 10,
    },
    orderSummaryContainer: {
        marginLeft: 'auto',  // This will push the content to the right
        width: '90%',       // This will make it take up 90% of the space
    },
});

const ReceiptDownload = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header with logos */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Logo />
                </View>
            </View>

            <View style={styles.mainContent}>
                <View style={styles.contentLeft}>
                    {/* Booking Info */}
                    <View style={styles.bookingInfo}>
                        <View>
                            <Text style={styles.bookingId}>Order # {data.transaction_id?.slice(-6)}</Text>
                        </View>
                        <View>
                            <Text style={styles.dateTime}>{formatDate(data.party?.start_date)}</Text>
                            <Text style={styles.dateTime}>{formatTime(data.party?.start_date)}</Text>
                        </View>
                    </View>

                    {/* Movie & Theater Info */}
                    <Text style={styles.movieTitle}>{data.party?.event_name}</Text>
                    <Text style={styles.movieInfo}>A</Text>
                    <Text style={styles.theaterInfo}>INOX Swabhumi,Maulana Abdul Kalam Azad Sarani</Text>
                    <Text style={styles.theaterInfo}>INOX Leisure Ltd.,89C, Moulana Abul Kalam Azad Sarani,Kolkata - 700 054Ph : 033 2320 8900 Fax : 033 2320 5551</Text>

                    <Text style={styles.screenInfo}>Screen 1</Text>
                    <Text style={styles.seatInfo}>CL-M11</Text>

                    <View style={styles.dividerSolidBody} />

                    {/* Order Summary */}
                    <Text style={styles.orderSummaryTitle}>Order Summary</Text>
                    <View style={styles.dividerDashedBody} />
                    <View style={styles.orderSummaryContainer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Ticket Cost</Text>
                            <Text style={styles.summaryValue}>1X Rs. 90</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Convenience Fee</Text>
                            <Text style={styles.summaryValue}>Rs. 20</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Service Tax</Text>
                            <Text style={styles.summaryValue}>Rs. 2.8</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Swachh Bharat Cess</Text>
                            <Text style={styles.summaryValue}>Rs. 0.1</Text>
                        </View>

                        <View style={styles.dividerDashed} />
                        <View style={styles.totalRow}>
                            <Text>Total</Text>
                            <Text>Rs. 112.9</Text>
                        </View>
                        <View style={styles.dividerDashed} />
                    </View>

                    {/* Booking Details */}
                    <Text style={styles.bookingDetails}>Booking Date: Friday,August 26,2016</Text>
                    <Text style={styles.bookingDetails}>Kiosk ID: 1572</Text>
                    <Text style={styles.bookingDetails}>Paytm Transaction ID: 2173745742</Text>
                </View>

                {/* QR Code */}
                <View style={styles.qrCode}>
                    <QRCode />
                </View>
            </View>

            <View style={styles.dividerSolid} />

            {/* Important Notes */}
            <View style={styles.importantNotes}>
                <Text style={styles.notesTitle}>Important Notes:</Text>
                <Text style={styles.noteText}>• Tickets & food once ordered cannot be exchanged, cancelled or refunded.</Text>
                <Text style={styles.noteText}>• Children aged 3 years and above will require a separate ticket.</Text>
                <Text style={styles.noteText}>• The 3D glasses will be available at the cinema for 3D films and must be returned before you exit the premises. 3D Glasses are chargeable (refundable/non-refundable) as per individual cinema policies.</Text>
                <Text style={styles.noteText}>• Items like laptop, cameras,knifes, lighter,match box, cigarettes, firearms and all types of inflammable objects are strictly prohibited.</Text>
                <Text style={styles.noteText}>• Items like carrybags eatables, helmets, handbags are not allowed inside the theaters are strictly prohibited. Kindly deposit at the baggage counter of mall/cinema.</Text>

                <Text style={styles.noteText}>Please check the suitability of the movie as per the Censor Board rating. Cinema management holds Rights of Admission and can deny admission for compliance of cinema policies.</Text>
                <Text style={styles.noteText}>• U : Unrestricted Public Exhibition throughout India, suitable for all age groups</Text>
                <Text style={styles.noteText}>• A : Viewing restricted to adults above 18 years only</Text>
                <Text style={styles.noteText}>• U/A : Unrestricted public exhibition with parental guidance for children below age 12</Text>
                <Text style={styles.noteText}>• S : Film is meant for specialized audience such as doctors</Text>
            </View>
        </Page>
    </Document>
);

export default ReceiptDownload;