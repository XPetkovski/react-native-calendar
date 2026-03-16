import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0052cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  tempButton: {
    backgroundColor: '#ff9900',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#0052cc',
    fontSize: 16,
  },
  biometricButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0052cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  biometricButtonText: {
    color: '#0052cc',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
});
