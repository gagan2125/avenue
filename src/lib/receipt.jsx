import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Svg, G, Path, Defs, ClipPath, Rect } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: '#ffffff',
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        color: '#000000',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 5,
        color: '#666666',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        marginBottom: 10,
        color: '#000000',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    label: {
        fontSize: 12,
        color: '#666666',
    },
    value: {
        fontSize: 12,
        color: '#000000',
    },
    total: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        borderTop: 1,
        borderColor: '#cccccc',
        paddingTop: 10,
    },
    footer: {
        marginTop: 30,
        textAlign: 'center',
        fontSize: 10,
        color: '#666666',
    },
});

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
      {/* Add other paths here as needed */}
    </G>
    <Defs>
      <ClipPath id="clip0_3029_535">
        <Rect width="177" height="26" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

const ReceiptDownload = ({ data }) => (
    <Document>
        <Page size="Letter" style={styles.page}>
            <View style={styles.header}>
                <Logo />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Receipt Details</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>{data.date}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Receipt ID:</Text>
                    <Text style={styles.value}>{data.ticketId}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Event Details</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Event:</Text>
                    <Text style={styles.value}>{data.eventName}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Venue:</Text>
                    <Text style={styles.value}>{data.venue}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Organizer:</Text>
                    <Text style={styles.value}>{data.organizerName}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ticket Details</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Ticket Type:</Text>
                    <Text style={styles.value}>{data.ticketName}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Price:</Text>
                    <Text style={styles.value}>${data.ticketPrice}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Quantity:</Text>
                    <Text style={styles.value}>{data.quantity}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.total}>Total Amount: ${data.totalAmount}</Text>
            </View>

            <View style={styles.footer}>
                <Text>Thank you for your purchase!</Text>
            </View>
        </Page>
    </Document>
);

export default ReceiptDownload;