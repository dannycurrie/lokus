export default (ctx, w, h) => {
  const colors = ['#0fffc1', '#7e0fff', '#233A8F', '#FFFFFF'];
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'none';
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  return () => {
    for (let i = 0; i < 1000; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.01})`;
      ctx.fillRect(
        Math.floor(Math.random() * w),
        Math.floor(Math.random() * h),
        Math.floor(Math.random() * 30) + 1,
        Math.floor(Math.random() * 30) + 1
      );

      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`;
      ctx.fillRect(
        Math.floor(Math.random() * w),
        Math.floor(Math.random() * h),
        Math.floor(Math.random() * 25) + 1,
        Math.floor(Math.random() * 25) + 1
      );
    }

    ctx.fillStyle = colors[Math.floor(Math.random() * 40)];
    ctx.fillRect(
      Math.random() * w,
      Math.random() * h,
      Math.random() * w,
      Math.random() * h
    );
  };
};
