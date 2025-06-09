const handler = () => {
  const json = JSON.stringify({ message: 'The service is OK' });
  return new Response(json, { status: 200 });
};

export { handler as GET };
