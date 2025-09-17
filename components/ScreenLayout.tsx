import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
    children: ReactNode;
};

export default function ScreenLayout({ children }: Props) {
    return (
        <View style={styles.inner}>{children}</View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fdfbff' },
    inner: { flex: 1, justifyContent: 'center'},
});