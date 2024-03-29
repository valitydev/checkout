import { Grid, Skeleton } from '@chakra-ui/react';

const PaneSkeleton = () => <Skeleton borderRadius="xl" height={28} />;

export const PanesSkeleton = () => (
    <Grid gap="4" templateColumns="repeat(2, 1fr)">
        <PaneSkeleton />
        <PaneSkeleton />
        <PaneSkeleton />
    </Grid>
);
