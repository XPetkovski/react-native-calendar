import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 30,
    color: '#333',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 30,
  },
  updateButton: {
    backgroundColor: '#0052cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#888',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  logoutButtonText: {
    color: '#888',
    fontSize: 18,
    fontWeight: 'bold'
  },
  deactivateButton: {
    backgroundColor: '#d71920',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  deactivateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
